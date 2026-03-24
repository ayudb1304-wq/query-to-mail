**Product Requirements Document (PRD): Query2Mail**

**1\. Product Overview**

* **Product Name:** Query2Mail (Working Title)  
* **Core Job-to-be-Done:** Execute custom SQL queries on a secure schedule and automatically email the results as formatted Excel files.  
* **Target Persona:** Lead Data Engineers, Database Administrators, and IT Operations Managers at mid-sized companies (50-500 employees).

**2\. Problem Statement** There is a fundamental disconnect between technical data teams (who use SQL) and business stakeholders (who rely almost entirely on Excel). Currently, companies are forced to buy complex, expensive Business Intelligence platforms like PowerBI, but end-users frequently find these tools overly complex and treat them simply as glorified SQL-to-Excel export tools. To bypass this, data engineers are forced to write and maintain fragile, custom Python scripts and cron jobs to query databases, generate Excel files, and email them to a recipient list.

**3\. Unique Selling Proposition (USP)** "Invisible BI." Query2Mail is a zero-UI reporting pipeline. There are no charts, graphs, or dashboards for stakeholders to log into. They simply receive a perfectly formatted Excel file in their inbox exactly when they need it. The tool aggressively markets its lack of user interface complexity.

**4\. Minimum Viable Product (MVP) Scope** The MVP must remain fiercely constrained so a solo developer can ship it in 2-4 weeks.

**Features In-Scope:**

* **Secure Connection Manager:** Ability to connect to external databases (initially limited to PostgreSQL and MySQL) using read-only credentials stored with AES-256 encryption.  
* **Minimalist Query Editor:** A simple, monospaced text area where the engineer writes the raw SQL query.  
* **Chronological Scheduler:** A robust cron-like engine allowing the user to select the execution frequency (e.g., weekly, daily at 8 AM) and input a comma-separated list of destination email addresses.  
* **Execution & Formatting Engine:** A backend worker that executes the query, streams the resulting JSON payload into an Excel generation library (like ExcelJS or a Python equivalent), and formats the file.  
* **Email Delivery System:** Integration with a transactional email provider (like Resend or Amazon SES) to dispatch the reports.  
* **Large Payload Fallback (Crucial):** If the generated Excel file exceeds standard email attachment limits, the system must automatically stream the file to a secure cloud storage bucket and email a time-expiring, authenticated download link instead.

**Features Out-of-Scope (Do Not Build):**

* Charts, graphs, pivot tables, or visual dashboards.  
* Complex user permission roles or multi-seat team accounts.  
* Native PDF invoice generation or NoSQL database support.

**5\. Technical Architecture & Risks**

* **Frontend:** Extremely lightweight. Built with simple forms and data-grids for the admin panel.  
* **Backend:** Node.js or Python backend focused entirely on cron job reliability and memory-efficient data streaming for large datasets.  
* **Primary Risk:** Managing database connection timeouts and payload limits. Processing massive SQL returns in-memory will crash the server, so the architecture must stream the database rows directly into the file generation stream rather than holding them in memory.

**6\. Monetization & Pricing**

* **Model:** B2B recurring monthly subscription utilizing a Merchant of Record designed for global SaaS sales.  
* **Tiers:** $29 to $79 USD per month, scaling based on the number of active database connections and the frequency/volume of scheduled queries.

