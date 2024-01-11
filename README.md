<a id='readme-top'></a>
# ParKing Reservations Server

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about">About</a>
      <ul>
        <li>
          <a href="#built-with">Built With</a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li>
          <a href="#prerequisites">Prerequisites</a>
        </li>
        <li>
          <a href="#installation">Installation</a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#endpoints">Endpoints</a>
    </li>
    <li>
      <a href="#database-schema">Database Schema</a>
    </li>
  </ol>
</details>

# About
<a id='about'></a>
RESTful API for our parKing application, which you can find <a href='https://github.com/pokemon-parKing/parKing-client' target='_blank'>here</a>.

### Built With
<a id='build-with'></a>

![node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)

# Getting Started

<a id='getting-started'></a>
Instructions to setup the API on your local machine below.

### Prerequisites
<a id='prerequisites'></a>

![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)

```sh
npm install npm@latest -g 
```
### Required Environment Variables
```sh
PORT=(the port you are using)
DB_HOST=(db uri)
DB_KEY=(our db api key)
GOOGLE_KEY=(google maps api key)
```

### Installation
<a id='installation'></a>

1. Clone the repo
   ```sh
   git clone https://github.com/pokemon-parKing/parKing-reservation-server
   ```
1. Install NPM packages
   ```sh
   npm install
   ```
1. Enter your ENV varaibles into a `.env` file
   ```
   See above for required variables
   ```
1. Start the Server
   ```sh
   npm run start
   ```



# Endpoints
<a id='endpoints'></a>
<details>
  <summary>/geocode [GET]</summary>
  <p></p>
  <div>Request: </div>
  
    params: { address: 'stringofyouraddress' }
    
  <sub>The minimum requirement for the address string is the street address</sub>
  <p></p>
  <div>Response:</div>
    
    { lat: number, lng: number }
    
</details>

<details>
  <summary>/reservations [GET]</summary>
  <p></p>
  <div>Request:<div> 
    

    params: { lat: number, lng: number }

    
  <p></p>
  <div>Response:</div>
  
    [Array of garage address objects]
  
</details>

<details>
  <summary>/reservations [POST]</summary>
  <p></p>
  <div>Request: </div>
    
    body: {
      garage_id: number,
      time: number (1-24),
      user_id: string,
      date: string ('12-3-21')
      car_id: number
    }
    

  <p></p>
  <div>Response:</div>

    status response of 201
  
</details>

<details>
  <summary>/reservations/:reservation_id [GET]</summary>
  <p></p>
  <div>Request: </div>
    
    query must contain a valid reservation_id

  <p></p>
  <div>Response:</div>

    { id, parking_spot_id, date, time, car_id, status, garage_id, user_id }
  
</details>

<details>
  <summary>/reservations/:reservation_id [PATCH]</summary>
  <p></p>
  <div>Request: </div>
    
    params: { status: string ['checked-in', 'picked-up', 'cancelled'] }

  <p></p>
  <div>Response:</div>

    status response of 200
  
</details>

<details>
  <summary>/reservations/garage/:garage_id [GET]</summary>
  <p></p>
  <div>Request: </div>
    
    params: { date: string ('12-3-21') }

  <p></p>
  <div>Response:</div>

    { "1": 20, "2": 12 } - an object with keys representing the hour(time) and a value that represents current # of reservations/checked-in
  
</details>

<details>
  <summary>/reservations/valet/:garage_id [GET]</summary>
  <p></p>
  <div>Request: </div>
    
    params: { date: string ('12-3-21'), time: integer (13) }

  <p></p>
  <div>Response:</div>

    { occupied: integer, reserved: integer, available: integer }
  
</details>

<details>
  <summary>/reservations/valet/list/:garage_id [GET]</summary>
  <p></p>
  <div>Request: </div>
    
    params: { date: string ('12-3-21') }

  <p></p>
  <div>Response:</div>

    [
      { 
        id: integer,
        time: integer,
        status: string, 
        parking_spot_id: integer, 
        cars: {
          make: string,
          color: string,
          model: string,
        }
      }
    ]
  
</details>

<details>
  <summary>/reservations/valet/detail/:reservation_id [GET]</summary>
  <p></p>
  <div>Request: </div>
    
    query must contain valid reservation_id

  <p></p>
  <div>Response:</div>

    [
      { 
        status: string,
        time: integer,
        parking_spot_id: integer,
        id: integer,
        date: string,   
        cars: {
          make: string,
          color: string,
          model: string,
          license_plate_number: string
        },
        accounts: {
          email: string,
          last_name: string,
          first_name: string,
          phone_number: string
        }
      }
    ]
  
</details>



# Database Schema
![Schema](https://github.com/pokemon-parKing/parKing-reservation-server/assets/144174704/848648c3-4682-4b17-a270-6231a65031de)



<p align="right"><a href="#readme-top">back to top</a></p>

