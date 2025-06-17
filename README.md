<h1 align="center" style="font-weight: bold;">ConfigBank 🏦</h1>

<p align="center">
 <a href="#tech">Technologies</a> • 
 <a href="#started">Getting Started</a> • 
 <a href="#routes">API Endpoints</a> •
 <a href="#colab">Collaborators</a>
</p>

<p align="center">
    <b>Aplicação Bancaria para a matéria DIM0517 - Gerência de Configuração e Mudanças</b>
</p>

<h2 id="technologies">💻 Technologies</h2>

- Node.js
- TypeScript
- Express.js
- Zod

<h2 id="started">🚀 Getting started</h2>

<h3>Prerequisites</h3>

- [Node.js](https://nodejs.org/)

<h3>Starting</h3>

```bash
cd ConfigBank
npm install
npm run start:dev
```

<h2 id="routes">📍 API Endpoints</h2>

List of available endpoints:
​
| route               | description                                          
|----------------------|-----------------------------------------------------
| <kbd>POST /api/banco/conta</kbd>     | create account [endpoint details](#post-account-detail)
| <kbd>POST /api/banco/conta?type=bonus</kbd>     | create bonus account [endpoint details](#post-bonus-account-detail)
| <kbd>POST /api/banco/conta?type=savings</kbd>     | create savings account [endpoint details](#post-savings-account-detail)
| <kbd>GET /api/banco/conta/:id/saldo</kbd>      | get balance by account [endpoint details](#get-balance-detail)
| <kbd>PUT /api/banco/conta/:id/credito</kbd>      | credit account [endpoint details](#post-credit-detail)
| <kbd>PUT /api/banco/conta/:id/debito</kbd>      | debit account [endpoint details](#post-debit-detail)
| <kbd>PUT /api/banco/conta/transferencia</kbd>      | transfer between accounts [endpoint details](#post-transfer-detail)
| <kbd>PUT /api/banco/conta/rendimento</kbd>      | earn interest for accounts [endpoint details](#post-earn-interest-detail)



<h3 id="post-account-detail">POST /api/banco/conta</h3>

**REQUEST**
```json
{
  "number": 1
}
```

**RESPONSE**
```json
{
  "number": 1,
  "balance": 0,
  "type": "normal"
}
```

<h3 id="post-bonus-account-detail">POST /api/banco/conta?type=bonus</h3>

**REQUEST**
```json
{
  "number": 1
}
```

**RESPONSE**
```json
{
  "number": 1,
  "balance": 0,
  "type": "bonus",
  "points": 10
}
```

<h3 id="post-savings-account-detail">POST /api/banco/conta?type=savings</h3>

**REQUEST**
```json
{
  "number": 1
}
```

**RESPONSE**
```json
{
  "number": 1,
  "balance": 0,
  "type": "savings",
}
```

<h3 id="get-balance-detail">GET /api/banco/conta/:id/saldo</h3>

**REQUEST**
```json
{
  "number": 1
}
```

**RESPONSE**
```json
0
```

<h3 id="post-credit-detail">PUT /api/banco/conta/:id/credito</h3>

**REQUEST**
```json
{
  "number": 1,
  "amount": 10
}
```

**RESPONSE**
```json
{
  "message": "Credit successful",
  "account": {
    "number": 1,
    "balance": 10
  }
}
```

<h3 id="post-debit-detail">PUT /api/banco/conta/:id/debito</h3>

**REQUEST**
```json
{
  "number": 1,
  "amount": 10
}
```

**RESPONSE**
```json
{
  "message": "Debit successful",
  "account": {
    "number": 1,
    "balance": -10
  }
}
```

<h3 id="post-transfer-detail">PUT /api/banco/conta/transferencia</h3>

**REQUEST**
```json
{
  "senderNumber": 1,
  "receiverNumber": 2,
  "amount": 10
}
```

**RESPONSE**
```json
{
  "message": "Transfer successful",
  "from": {
    "number": 1,
    "balance": 0
  },
  "to": {
    "number": 2,
    "balance": 10
  }
}
```

<h3 id="post-earn-interest-detail">PUT /api/banco/conta/rendimento</h3>

**REQUEST**
```json
{
  "interest": 10
}
```

**RESPONSE**
```json
[
{
  "number": 1,
  "balance": 0,
  "type": "savings",
}
]
```

<h2 id="colab">🤝 Collaborators</h2>

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/DanielLucena">
        <img src="https://avatars.githubusercontent.com/u/12564417?v=4" width="100px;" alt="Daniel Lucena Profile Picture"/><br>
        <sub>
          <b>Daniel Lucena</b>
          <br>
            DanielLucena
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/marcosmn">
        <img src="https://avatars.githubusercontent.com/u/30351698?v=4" width="100px;" alt="Marcos Martins Profile Picture"/><br>
        <sub>
          <b>Marcos Martins</b>
          <br>
          marcosmn
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/oscarkemuel">
        <img src="https://avatars.githubusercontent.com/u/34771800?v=4" width="100px;" alt="Oscar Kemuel Profile Picture"/><br>
        <sub>
          <b>Oscar Kemuel</b>
          <br>
          oscarkemuel
        </sub>
      </a>
    </td>
  </tr>
</table>
