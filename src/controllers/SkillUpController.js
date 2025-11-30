import UserSkillUp from '../models/UserSkillUp.js';
import Phase from '../models/Phase.js';
import Product from '../models/Product.js'; // CORREÇÃO: Necessário para o populate em getUserMe funcionar

// Mapa constante para definir os nomes dos grupos baseados no ID
const GROUP_NAMES = {
  1: 'Aventura em Alto Mar',
  2: 'Jornada nas Montanhas',
  3: 'Expedição na Floresta',
  4: 'Viagem pelo Deserto',
  5: 'Mundo Subterrâneo'
};

async function getOrCreateUserSkillUp(user) {
  let userSkill = await UserSkillUp.findOne({ email: user.email });

  if (!userSkill) {
    userSkill = new UserSkillUp({
      name: user.name,
      email: user.email,
      coins: 0,
      lifesRemaining: 5
    });
    await userSkill.save();
  }

  return userSkill;
}

function applyLifeRegeneration(userSkill) {
  const maxLives = 5;
  const intervalMs = 10 * 60 * 1000;
  const now = new Date();
  let modified = false;

  if (userSkill.lifesRemaining >= maxLives) {
    if (userSkill.dateLostLife) {
      userSkill.dateLostLife = null;
      modified = true;
    }
    return { userSkill, modified };
  }

  if (!userSkill.dateLostLife) {
    userSkill.dateLostLife = now;
    modified = true;
    return { userSkill, modified };
  }

  const diffMs = now - userSkill.dateLostLife;
  if (diffMs < intervalMs) {
    return { userSkill, modified };
  }

  const intervals = Math.floor(diffMs / intervalMs);
  if (intervals <= 0) {
    return { userSkill, modified };
  }

  const livesToRecover = Math.min(intervals, maxLives - userSkill.lifesRemaining);
  if (livesToRecover <= 0) {
    return { userSkill, modified };
  }

  userSkill.lifesRemaining += livesToRecover;
  if (userSkill.lifesRemaining >= maxLives) {
    userSkill.lifesRemaining = maxLives;
    userSkill.dateLostLife = null;
  } else {
    const remainder = diffMs % intervalMs;
    userSkill.dateLostLife = new Date(now - remainder);
  }

  modified = true;
  return { userSkill, modified };
}

class SkillUpController {
  
  async canAccessRecommendationMode(req, res) {
    try {
      const userSkill = await getOrCreateUserSkillUp(req.user);
      const playedCount = Array.isArray(userSkill.playedPhases) ? userSkill.playedPhases.length : 0;

      return res.json({ canAccess: playedCount >= 10 });
    } catch (error) {
      console.error('Error on /game-mode/can-access-recommendation-mode:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getCampaignPhaseGroups(req, res) {
    try {
      const userSkill = await getOrCreateUserSkillUp(req.user);
      
      const allPhases = await Phase.find().sort({ group: 1, position: 1 }).lean();

      const playedPhases = Array.isArray(userSkill.playedPhases) ? userSkill.playedPhases : [];
      const playedMap = new Map();
      playedPhases.forEach(p => {
        if (p.phase) playedMap.set(String(p.phase), p);
      });

      const groupsMap = new Map();

      [1, 2, 3, 4, 5].forEach(groupId => {
        groupsMap.set(groupId, {
          id: groupId,
          name: GROUP_NAMES[groupId] || `Grupo ${groupId}`,
          phases: []
        });
      });

      allPhases.forEach(phase => {
        const groupId = phase.group || 1;
        
        if (!groupsMap.has(groupId)) {
          groupsMap.set(groupId, {
            id: groupId,
            name: GROUP_NAMES[groupId] || `Grupo ${groupId}`,
            phases: []
          });
        }

        const group = groupsMap.get(groupId);
        const playedData = playedMap.get(String(phase._id));

        const playedPhaseObj = playedData
          ? {
              phaseId: String(phase._id),
              won: !!playedData.completed,
              starsEarned: typeof playedData.starsEarned === 'number' ? playedData.starsEarned : 0,
              score: typeof playedData.score === 'number' ? playedData.score : 0,
              datePlayed: playedData.datePlayed || null
            }
          : null;

        group.phases.push({
          id: String(phase._id),
          name: phase.name,
          isBossPhase: !!phase.isBossPhase,
          position: phase.position,
          playedPhase: playedPhaseObj
        });
      });

      const result = Array.from(groupsMap.values());
      return res.json(result);

    } catch (error) {
      console.error('Error on /campaign/phase-groups:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async assignPhasesToCurrentUser(req, res) {
    try {
      const userSkill = await getOrCreateUserSkillUp(req.user);
      const phasesInput = req.body && Array.isArray(req.body.phases) ? req.body.phases : null;

      if (!phasesInput || phasesInput.length === 0) {
        return res.status(400).json({ error: 'phases array is required' });
      }

      const phaseIds = phasesInput
        .map(item => item && item.phaseId)
        .filter(id => !!id);

      if (phaseIds.length === 0) {
        return res.status(400).json({ error: 'At least one valid phaseId is required' });
      }

      const uniquePhaseIds = Array.from(new Set(phaseIds.map(id => String(id))));
      const phases = await Phase.find({ _id: { $in: uniquePhaseIds } }).select('_id').lean();
      const validIdsSet = new Set(phases.map(phase => String(phase._id)));

      const invalidPhaseIds = uniquePhaseIds.filter(id => !validIdsSet.has(id));
      if (invalidPhaseIds.length > 0) {
        return res.status(400).json({
          error: 'Some phaseIds do not exist',
          invalidPhaseIds
        });
      }

      if (!Array.isArray(userSkill.playedPhases)) {
        userSkill.playedPhases = [];
      }

      // Preenche datas antigas se faltarem
      userSkill.playedPhases.forEach(entry => {
        if (!entry.datePlayed && entry.completed) {
          entry.datePlayed = new Date();
        }
      });

      phasesInput.forEach(item => {
        const id = item && item.phaseId ? String(item.phaseId) : null;
        if (!id || !validIdsSet.has(id)) {
          return;
        }

        const existingEntry = userSkill.playedPhases.find(p => String(p.phase) === id);

        const completedProvided = typeof item.completed === 'boolean';
        const scoreProvided = typeof item.score === 'number';
        const starsProvided = typeof item.starsEarned === 'number';

        if (existingEntry) {
          if (completedProvided) existingEntry.completed = item.completed;
          if (scoreProvided) existingEntry.score = item.score;
          if (starsProvided) existingEntry.starsEarned = item.starsEarned;
          
          if (item.datePlayed) {
            existingEntry.datePlayed = new Date(item.datePlayed);
          } else if (!existingEntry.datePlayed) {
            existingEntry.datePlayed = new Date();
          }
        } else {
          userSkill.playedPhases.push({
            phase: id,
            completed: completedProvided ? item.completed : false,
            score: scoreProvided ? item.score : 0,
            starsEarned: starsProvided ? item.starsEarned : 0,
            datePlayed: item.datePlayed ? new Date(item.datePlayed) : new Date()
          });
        }
      });

      await userSkill.save();

      const responsePlayedPhases = (userSkill.playedPhases || []).map(entry => ({
        phaseId: String(entry.phase),
        completed: !!entry.completed,
        score: typeof entry.score === 'number' ? entry.score : 0,
        starsEarned: typeof entry.starsEarned === 'number' ? entry.starsEarned : 0,
        datePlayed: entry.datePlayed || null
      }));

      return res.json({
        data: {
          email: userSkill.email,
          playedPhases: responsePlayedPhases
        }
      });
    } catch (error) {
      console.error('Error on /skillup/user/me/played-phases assign:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getPlayedPhasesByEmail(req, res) {
    try {
      const email = req.params.email || (req.query && req.query.email);

      if (!email) {
        return res.status(400).json({ error: 'email is required' });
      }

      const userSkill = await UserSkillUp.findOne({ email }).populate('playedPhases.phase');

      if (!userSkill) {
        return res.status(404).json({ error: 'User not found' });
      }

      const playedPhasesDocs = Array.isArray(userSkill.playedPhases) ? userSkill.playedPhases : [];

      const playedPhases = playedPhasesDocs.map(entry => {
        const hasPhaseDoc = entry.phase && entry.phase._id;
        const phaseDoc = hasPhaseDoc ? entry.phase : null;

        return {
          phaseId: String(phaseDoc ? phaseDoc._id : entry.phase),
          phaseName: phaseDoc ? phaseDoc.name : null,
          group: phaseDoc && typeof phaseDoc.group === 'number' ? phaseDoc.group : null,
          position: phaseDoc && typeof phaseDoc.position === 'number' ? phaseDoc.position : null,
          completed: !!entry.completed,
          score: typeof entry.score === 'number' ? entry.score : 0,
          starsEarned: typeof entry.starsEarned === 'number' ? entry.starsEarned : 0,
          datePlayed: entry.datePlayed || null
        };
      });

      return res.json({
        data: {
          email: userSkill.email,
          playedPhases
        }
      });
    } catch (error) {
      console.error('Error on /skillup/user/played-phases:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProducts(req, res) {
    try {
      const products = await Product.find().lean();
      return res.json({ data: products });
    } catch (error) {
      console.error('Error on /skillup/products:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async buyProduct(req, res) {
    try {
      const userSkill = await getOrCreateUserSkillUp(req.user);
      const productId = req.body && req.body.productId;

      if (!productId) {
        return res.status(400).json({ error: 'productId is required' });
      }

      const product = await Product.findById(productId).lean();

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (userSkill.coins < product.price) {
        return res.status(400).json({ error: 'Not enough coins' });
      }

      userSkill.coins -= product.price;
      userSkill.itemsOwned.push(product._id);
      await userSkill.save();

      return res.json({ data: userSkill });
    } catch (error) {
      console.error('Error on /skillup/user/me/buy-product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async equipItem(req, res) {
    try {
      const userSkill = await getOrCreateUserSkillUp(req.user);
      const itemId = req.body && req.body.itemId;

      if (!itemId) {
        return res.status(400).json({ error: 'itemId is required' });
      }

      const product = await Product.findById(itemId).lean();

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (!userSkill.itemsOwned.includes(product._id)) {
        return res.status(400).json({ error: 'Item already equipped' });
      }
      userSkill.equippedItems.push(product._id);
      await userSkill.save();

      return res.json({ data: userSkill });
    } catch (error) {
      console.error('Error on /skillup/user/me/equip-item:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getUserMe(req, res) {
    try {
      // O 'equippedItems' vai funcionar agora porque importamos o Product.js no topo
      let userSkill = await UserSkillUp.findOne({ email: req.user.email }).populate('equippedItems');

      if (!userSkill) {
        userSkill = new UserSkillUp({
          name: req.user.name || req.user.email,
          email: req.user.email,
          coins: 0,
          lifesRemaining: 5
        });
      }

      const { modified } = applyLifeRegeneration(userSkill);

      if (userSkill.isNew || modified) {
        await userSkill.save();
      }

      const equippedItemsDocs = Array.isArray(userSkill.equippedItems) ? userSkill.equippedItems : [];

      const typeMap = {
        headwear: 'HEAD_WEAR',
        gloves: 'GLOVES',
        weapon: 'WEAPON',
        footwear: 'FOOT_WEAR'
      };

      const rarityMap = {
        common: 'COMMON',
        rare: 'RARE',
        legendary: 'LEGENDARY'
      };

      const equippedItems = equippedItemsDocs.map(item => ({
        id: String(item._id),
        name: item.name,
        imageUrl: item.url || '',
        price: item.price,
        type: typeMap[item.type] || item.type,
        rarity: rarityMap[item.rarity] || item.rarity
      }));

      return res.json({
        data: {
          id: String(req.user._id),
          name: userSkill.name,
          email: userSkill.email,
          coins: userSkill.coins,
          lifesRemaining: userSkill.lifesRemaining,
          dateLostLife: userSkill.dateLostLife,
          mathSkillPoints: userSkill.mathSkillPoints,
          languageSkillPoints: userSkill.languageSkillPoints,
          scienceSkillPoints: userSkill.scienceSkillPoints,
          historySkillPoints: userSkill.historySkillPoints,
          equippedItems,
          createdAt: userSkill.createdAt,
          updatedAt: userSkill.updatedAt
        }
      });
    } catch (error) {
      console.error('Error on /user/me:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  authSkillupCallback(req, res) {
    try{
      return res.redirect('/login');
    }
    catch(error){
      console.error('Error on /skillup/auth/callback:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new SkillUpController();