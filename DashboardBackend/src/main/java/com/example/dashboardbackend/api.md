# **Dashboard API Markdown**
**Base URL:**
http://localhost:8080/api/dashboard <br>
**CORS Allowed Origins:**
http://localhost:3000, https://silver-granita-51321f.netlify.app/

## **1. Transactions Status Trend `(GET /trends)`**
- **Description:** 
  - Return bucketed data by minute for "Daily", by day for "Weekly", by date for "Monthly"
- **Required Data**:
    - `transaction_status`
    - `transaction_timestamp`
___
## **2. Top 10 Ticket Size Table `(GET /tickets)`**
- **Description:**
    - Return top 10 individual transactions filtered by date("Daily", "Weekly", "Monthly") and sorted by specific criteria ("Amount", "Timestamp").
- **Required Data**:
    - `transaction_id`
    - `transaction_amount`
    - `transaction_status`
    - `transaction_merchant`
    - `transaction_timestamp`
___
## **3. Top 10 Merchants Table `(GET /merchants)`**
- **Description:**
    - Return top 10 merchants filtered by date("Daily", "Weekly", "Monthly") and sorted by specific criteria ("Amount", "Volume").
- **Required Data**:
    - `transaction_amount`
    - `transaction_merchant`
___
## **4. Top 5 Payment Methods `(GET /payments)`**
- **Description:**
    - Return top 5 payment methods filtered by date("Daily", "Weekly", "Monthly") and sorted by specific criteria ("Amount", "Volume").
- **Required Data**:
    - `transaction_amount`
    - `transaction_merchant`
    - `transaction_category` (Payment Methods)

---
## 5. **Data Ingestion `(POST /ingest)`**
- **Description**:
  - Acts as a Producer. External data sent here and is queued in transactions Kafka topic.
- **Request Body (JSON)**:
  {
    "merchant": "ABC",
    "amount": 35.50,
    "category": "Visa",
    "status": "success"
  }