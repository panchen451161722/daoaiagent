# Alive DAO
Revolutionizing DAO Governance with AI - Powered Proposal Management

## 🚀 Features

- **Intelligent Decision Making**: The DAO AI Agent can analyze complex data and make informed decisions for the DAO, optimizing resource allocation and strategy planning.
- **Automated Governance**: It automates certain governance processes, reducing the need for manual intervention and increasing the efficiency of the DAO's operations.
- **Transparency and Accountability**: Utilizes blockchain technology to ensure all actions and decisions are transparent and traceable, enhancing trust among DAO members.
- **Adaptive Learning**: Continuously learns from new data and experiences, improving its performance over time and adapting to changing market conditions.

## 🛠️ How It's Made
### Technology Stack

- **[LangGraph/LangChain](https://www.langchain.com/langgraph)**: Framework for building our multi-agent & dynamic workflow systems.
- **[Autonome](https://www.autono.meme/)**: Deploy and host agents on Autonome.
- **[CDP AgentKit](https://docs.cdp.coinbase.com/)**: Agent toolkit for on-chain interaction. DAO Agents can update proposal status to the blockchain.
- **[The Graph](https://thegraph.com/)**: Indexing protocol for querying blockchain data.
- **[Solidity](https://soliditylang.org/)**: Smart contract programming language for interacting with the blockchain.
- **[Next.js/React](https://nextjs.org/)**: UI development. Next.js is a React framework that provides server-side rendering, static site generation, and other features to build modern web applications. React is a JavaScript library for building user interfaces, which allows for the creation of reusable UI components.
- **[shadcn](https://ui.shadcn.com/)**: UI framework. It offers a collection of reusable UI components that can be easily customized to fit the design requirements of the project.
- **[connectKit](https://docs.family.co/connectkit)/[wagmi](https://wagmi.sh/)**: Blockchain connection. ConnectKit is a wallet connection library that simplifies the process of connecting users' wallets to the application. Wagmi is a React Hooks library for Ethereum that provides a set of tools for interacting with the blockchain.

### Development Workflow

![System Architecture](ui/public/committee.drawio.svg)
1. **UI submit data directly to blockchain**
2. **subgraph indexed the data from blockchain**
3. **UI get data from subgraph**

### Deployment Details

![System Architecture](ui/public/arch.drawio.svg)
- Base Sepolia:[0x27fde4b919abebd6cf2c550b5da442d89ed203f5](https://sepolia.basescan.org/address/0x27fde4b919abebd6cf2c550b5da442d89ed203f5)

## 💡 Future Improvements

- Integration with more blockchain platforms to increase the DAO's reach and flexibility.
- Enhanced AI algorithms for more accurate decision making and prediction.
- Development of a user-friendly interface for easier interaction with the DAO AI Agent.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

**Start exploring the possibilities of DAO governance with the DAO AI Agent!** 🌐🤖
