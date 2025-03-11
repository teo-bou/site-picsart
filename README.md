# site-picsart

## Prerequisites
- MariaDB
- Composer
- NodeJS
- PHP

## Setup (be in the site-picsart folder)

1. **Install Dependencies**
    ```sh
    npm install
    ```
    => Install the NodeJS libraries, namely React...

2. **Edit `php.ini`**
    - Uncomment the line `extension=zip` in your `php.ini` file.
    => This is required for zip file downloads to work.

3. **Database Setup**
    - Ensure MariaDB server is running.
    - Create a database named `site_picsart`:
      ```sh
      mysql -u root -p
      CREATE DATABASE site_picsart;
      ```
    - Update the `.env` file with your database credentials.

4. **Run Migrations**
    ```sh
    php artisan migrate
    ```
    => You need the MariaDB server to be running at the same time
    => Allow the schema of the database to be created in SQL

5. **Link Storage**
    ```sh
    php artisan storage:link
    ```

6. **Generate Application Key**
    ```sh
    php artisan key:generate
    ```

7. **Create Session Table**
    ```sh
    php artisan session:table
    php artisan migrate
    ```

8. **Development Server**
    ```sh
    composer run dev
    ```

## Running the Project
Each time you want to run the project, use:
```sh
composer run dev
```
