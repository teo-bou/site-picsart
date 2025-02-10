# site-picsart

## Prerequisites
- MariaDB
- Composer
- NodeJS
- PHP

## Setup

1. **Install Dependencies**
    ```sh
    npm install
    ```
    => Install the NodeJS libraries, namely React...

2. **Database Setup**
    - Ensure MariaDB server is running.
    - Create a database named `site_picsart`.
    - Update the `.env` file with your database credentials.

3. **Run Migrations**
    ```sh
    php artisan migrate
    ```
    => You need the MariaDB servor to be running at the same time
    => Allow the schema of the databse to be created in SQL

4. **Development Server**
    ```sh
    composer run dev
    ```

## Running the Project
Each time you want to run the project, use:
```sh
composer run dev
```