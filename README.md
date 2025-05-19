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
| <kbd>POST /api/account</kbd>     | create account [endpoint details](#post-account-detail)
| <kbd>GET /api/account/balance</kbd>      | get balance by account [endpoint details](#get-balance-detail)
| <kbd>POST /api/debit</kbd>      | debit account [endpoint details](#post-debit-detail)
| <kbd>POST /api/credit</kbd>      | credit account [endpoint details](#post-credit-detail)
| <kbd>POST /api/transfer</kbd>      | transfer between accounts [endpoint details](#post-transfer-detail)



<h3 id="post-account-detail">POST /api/account</h3>

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
	"balance": 0
}
```

<h3 id="get-balance-detail">GET /api/account/balance</h3>

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

<h3 id="post-debit-detail">POST /api/debit</h3>

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

<h3 id="post-credit-detail">POST /api/credit</h3>

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

<h3 id="post-transfer-detail">POST /api/transfer</h3>

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
