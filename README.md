# Performance Dashboard

A web application for generating and visualizing performance metrics, including 
- **Overview** 
- **Performance Dashboard** 
- **Service Dashboard**
- **Tools**
- **Config**
...reports, with configurable customer settings and static expenses. Built for businesses to track revenue, orders, ad spend, and other key metrics, with a user-friendly interface for data analysis and configuration management.

---

## 🚀 Features (TBD)

### Pace Report

- **Budget Graph**: Displays cumulative revenue and ad spend against monthly budget targets. Revenue and revenue budget appear on the **left y-axis**; ad spend and ad spend budget on the **right y-axis** for clarity.
- **Pace Graph**: Visualizes cumulative revenue or orders (selectable) and ad spend, with ad spend using the right y-axis to balance scale.
- **Metrics Tracked**:
  - Orders
  - Revenue
  - Ad Spend
  - ROAS (Return on Ad Spend)
  - Pace
  - Suggested Daily Adjustment

- **Date Picker**: Custom date range support (e.g., 2024-07-28 to 2024-07-30).
- **Comparison Options**:
- Previous Year
- Previous Period
- Visual delta indicators (green for ↑, red for ↓)
- **Data Sources**:
- Shopify (transactions)
- Facebook Ads (ads_insights)
- Google Ads (campaign)
- Integrated via **BigQuery**

### Config Page

- **Objectives**: View and edit revenue budgets via form and table.
- **Customer Info**: Manage customer data stored in MongoDB.
- **Static Expenses**: Configure items like `cogs_percentage`, `shipping_cost_per_order`, etc.
- **API Integration**: Fetch and update config data via RESTful endpoints.

---

## 🛠️ Technologies Used

### Frontend

- **Next.js**: SSR and static site generation.
- **React**: UI components.
- **Chart.js + react-chartjs-2**: Graph rendering.
- **Tailwind CSS**: Modern styling framework.
- **Next/Image**: Optimized images.

### Backend

- **Node.js**: API and server logic.
- **MongoDB**: NoSQL database for config storage.
- **Mongoose**: Schema and query management.
- **BigQuery**: For querying Shopify, Facebook, and Google Ads data.

### API

- **Next.js API Routes**:
- `/api/customers/[customerId]`: GET & PUT
- `/api/config-static-expenses/[customerId]`: GET & PUT
- **RESTful Endpoints** for config updates.

### Environment

- **Deployment**: Vercel (assumed)
- **Environment Variables**:
- `NEXT_PUBLIC_BASE_URL`
- `MONGODB_URI` (set via `.env.local`)

---

## 📁 Project Structure
performance-dashboard/ <br>
├── app/ <br>
│ ├── api/ <br>
│ │ ├── customers/[customerId]/route.js # GET/PUT customer info <br>
│ │ ├── config-static-expenses/[customerId]/ # GET/PUT static expenses <br>
│ │ ├── config-revenue-budget/[customerId]/ # GET revenue budget <br>
│ ├── components/ <br>
│ │ ├── ConfigForm.jsx # Form for objectives <br>
│ │ ├── ConfigTable.jsx # Table for objectives <br>
│ │ ├── CustomerInfo.jsx # Customer info editing <br>
│ │ ├── StaticExpenses.jsx # Static expenses editing <br>
│ ├── config/[customerId]/page.jsx # Config page <br>
│ ├── pace-report/[customerId]/page.jsx # Pace Report page <br>
│ ├── pace-report/pace-report.jsx # Pace Report component <br>
├── lib/ <br>
│ ├── dbConnect.js # MongoDB connection <br>
│ ├── functions/fetchCustomerDetails.js # Fetch customer details <br>
│ ├── bigQueryConnect.js # BigQuery utility <br>
├── models/ <br>
│ ├── Customer.js # Mongoose schema <br>
├── public/ <br>
│ ├── images/shape-dotted-light.svg # Background image <br>
├── .env.local # Environment variables <br>
├── package.json # Dependencies & scripts <br>

## 📊 Usage

Config Page
Navigate to /config/[customerId]

Update:
- Objectives
- Customer Info
- Static Expenses

| Method | Endpoint                                   | Description             |
| ------ | ------------------------------------------ | ----------------------- |
| GET    | `/api/customers/[customerId]`              | Fetch customer details  |
| PUT    | `/api/customers/[customerId]`              | Update customer details |
| GET    | `/api/config-static-expenses/[customerId]` | Fetch static expenses   |
| PUT    | `/api/config-static-expenses/[customerId]` | Update static expenses  |
| GET    | `/api/config-revenue-budget/[customerId]`  | Fetch revenue budget    |

## 📦 Data Sources
BigQuery
Tables:
- https://www.drawdb.app/editor?shareId=3dbf841797ef8d36c58193a13894e57a