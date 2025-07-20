# Projeto de Extensão 2
	
## 1. Como executar o Projeto:

- Clonar o repositório:  
`git clone https://github.com/Extensao2/extensao-server.git`

- Iniciar a execução:  
`make start`
- Interromper a execução:  
`make stop`

## 2. Premissa do Projeto:

Construir uma API robusta para uma plataforma de estudos não-linear, possibilitando que o usuário a pesquise conteúdos e presonalize sua jornada de aprendizagem seguindo suas preferências e necessidades.
	
## 3. Referências do Projeto:

- [Roadmap.sh](https://roadmap.sh/)
- [The Odin Project](https://www.theodinproject.com/)
- [FreeCodeCamp](https://www.freecodecamp.org/)

## 4. Fluxo das rotas:

`POST /login`:

```mermaid
flowchart TD
A[POST /login]
B{Formato válido?}
C[Consulta token
junto ao
Google]
D[400]
E{Token válido?}
F[Consulta se
usuário existe
no banco]
G[401]
H{Usuário
existe no
banco?}
I[Consulta no
banco se já
existe uma
sessão aberta]
J[Cadastra
usuário
no banco]
K{Existe uma
sessão aberta?}
L[200 + cookie]
M[Cadastra uma
nova sessão]

A --> B
B --> |Sim| C
B--> |Não| D
C --> E
E --> |Sim| F
E --> |Não| G
F --> H
H --> |Sim| I
H --> |Não| J
J --> I
I --> K
K --> |Sim| L
K --> |Não| M
M --> L
```

---

`GET /resource`:

```mermaid
flowchart TD

A[GET /resource]
B{Formato válido?}
C[Consulta cookie
e sessão aberta]
D[400]
E{Cookie válido?}
F[Consulta se
recurso existe]
G[401]
H{Recurso existe?}
I{Possui recurso na 
cache local?}
J[404]
K[200]
L[304]
M[Cadastra evento novo]

A --> B
B --> |Sim| C
B --> |Não| D
C --> E
E --> |Sim| F
E -->| Não| G
F --> H
H --> |Sim| M
M --> I
H --> |Não| J
I --> |Não| K 
I --> |Sim| L
```

---

`PUT /resource`:

```mermaid
flowchart TD

A[PUT /resource]
B{Formato válido?}
C[Consulta cookie
e sessão aberta]
D[400]
E{Cookie válido?}
F[Consulta se
recurso existe]
G[401]
H{Recurso existe?}
I[403]
K[201]

subgraph Ação atômica
J[Cadastra recurso]
L[Cadastra evento]
end

A --> B
B --> |Sim| C
B --> |Não| D
C --> E
E --> |Sim| F
E -->| Não| G
F --> H
H --> |Sim| I
H --> |Não| J
J --> L
L --> K
```

---

`PATCH /resource`:

```mermaid
flowchart TD

A[PATCH /resource]
B{Formato válido?}
C[Consulta cookie
e sessão aberta]
D[400]
E{Cookie válido?}
F[Consulta se
recurso existe]
G[401]
H{Recurso existe?}
subgraph Ação Atômica
I[Atualiza recurso]
L[Cadastra evento]
end
J[404]
K[200]


A --> B
B --> |Sim| C
B --> |Não| D
C --> E
E --> |Sim| F
E -->| Não| G
F --> H
H --> |Sim| I
H --> |Não| J
I --> L
L --> K
```

---

`DELETE /resource`:

```mermaid
flowchart TD

A[DELETE /resource]
B{Formato válido?}
C[Consulta cookie
e sessão aberta]
D[400]
E{Cookie válido?}
F[Consulta se
recurso existe]
G[401]
H{Recurso existe?}
subgraph Ação atômica
I[Cadastra recurso]
L[Cadastra evento]
end
J[404]
K[204]

A --> B
B --> |Sim| C
B --> |Não| D
C --> E
E --> |Sim| F
E -->| Não| G
F --> H
H --> |Sim| I
H --> |Não| J
I --> L
L --> K
```
---

`GET /events`:

```mermaid
flowchart TD

A[GET /events]
B{Formato válido?}
C[Consulta cookie
e sessão aberta]
D[400]
E{Cookie válido?}
G[401]
I{Possui recurso na 
cache local?}
K[200]
L[304]

A --> B
B --> |Sim| C
B --> |Não| D
C --> E
E --> |Sim| I
E -->| Não| G
I --> |Não| K 
I --> |Sim| L
```

---

`GET /events (com filtro)`:

```mermaid
flowchart TD

A[GET /events filtro]
B{Formato da requisicao valido?}
C[Consulta cookie e sessao aberta]
D[400]
E{Cookie e sessao validos?}
F[Consulta existencia de eventos com filtros]
G[401]
H{Existe evento com filtros?}
I{Possui recurso no cache local?}
J[404]
K[200]
L[304]

A --> B
B --> |Sim| C
B --> |Nao| D

C --> E
E --> |Sim| F
E --> |Nao| G

F --> H
H --> |Sim| I
H --> |Nao| J

I --> |Sim| L
I --> |Nao| K

```