https://chatgpt.com/c/68038dc3-3c64-8009-80f9-c9e4d7266539Step	Description	Status

--- 
TODO: 
- On login, add the google user data to database (users model) ✅
    - Only add if they do not already exist, email should be the unique ID ✅
- Properties model:
    - Make a new database model (Properties)
    - This database should store the users properties
    - This would mean that the initial GA4 properties that are loaded under "/ga4-properties", should have a button that syncs the GA4 properties with the database model "Properties"
    - The "Properties" model should be referencing the user model
    - That way we store the properties in the database, instead of calling the GA4 api all the time (faster)
    - It should be possible to "re-sync" the properties with a button (mentioned earlier), in case new properties are added to the GA4 account
        - DO NOT resync existing properties to database
    - The "Properties" should have a "tracked" object
        - the "tracked" object can consist of the following:
        - tracked: {
            "isTracked": boolean,
            "lastTimeTracked": date,
            "isGTMFound": boolean,
            "ga4PropertyData": {
                "activeUsers": INT,
                "sessions": INT,
                ...
            }
        }
- Figure out an UI that makes sense for all this