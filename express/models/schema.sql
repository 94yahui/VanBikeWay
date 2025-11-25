PRAGMA foreign_keys = ON;

-- Make forign key work in the this sql.
-- Use DROP to avoid exists error
DROP TABLE IF EXISTS coordinates;

CREATE TABLE
    coordinates (
        bikeway_id INTEGER,
        -- Longitude and latitude should be decimal, so I use REAL as type of value, it shouldn' be empty value, so I set NOT NULL as condition
        start_lon REAL CONSTRAINT "start_lon shouldn't be empty" NOT NULL,
        start_lat REAL CONSTRAINT "start_lat shouldn't be empty" NOT NULL,
        end_lon REAL CONSTRAINT "end_lon shouldn't be empty" NOT NULL,
        end_lat REAL CONSTRAINT "end_lat shouldn't be empty" NOT NULL,
        PRIMARY KEY (bikeway_id) -- Set primary key
    );

----------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS geo_point;

CREATE TABLE
    geo_point (
        bikeway_id INTEGER,
        lon REAL CONSTRAINT "Lon shouldn't be empty" NOT NULL,
        lat REAL CONSTRAINT "Lat shouldn't be empty" NOT NULL,
        PRIMARY KEY (bikeway_id)
    );

----------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS surface_type;

CREATE TABLE
    surface_type (id INTEGER, name TEXT, PRIMARY KEY (id));

----------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS bikeway;

CREATE TABLE
    bikeway (
        id INTEGER,
        bikewayId INTEGER,
        name TEXT CONSTRAINT "Name must have at least one letter" CHECK (LENGTH (name) > 0) NOT NULL, --I use CHECK and LEGTH condition to ensure name is at least on letter, and it's type should be text
        year INTEGER CONSTRAINT "Year must greater or equals 0" CHECK (year > 0),
        -- Year should be a number, so I use INTEGER as its value type, and use CHECK condition to ensure it is not negetive
        status TEXT CONSTRAINT "Status must have at least one letter" CHECK (LENGTH (status) > 0) NOT NULL,
        comment_count INTEGER DEFAULT 0 CONSTRAINT "Comment must greater or equals 0" CHECK (comment_count >= 0),
        --Here I set default comment_count as 0 when there is no comment
        speedLimit REAL,
        -- SpeedLimit is also a number
        surface_type_id INTEGER NOT NULL, --Foreign key can not be null
        PRIMARY KEY (bikewayId),
        FOREIGN KEY (surface_type_id) REFERENCES surface_type (id) ON DELETE CASCADE
    );

----------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS likes;

CREATE TABLE
    likes (
        id INTEGER,
        bikeway_id INTEGER NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (bikeway_id) REFERENCES bikeway (bikewayId) ON DELETE CASCADE
    );

----------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS comment;

CREATE TABLE
    comment (
        id INTEGER,
        bikeway_id INTEGER NOT NULL, --Foreign key can not be null
        date DATETIME DEFAULT (DATETIME ('now')),
        content TEXT CONSTRAINT "Content must have at least one letter" CHECK (LENGTH (content) > 0) NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (bikeway_id) REFERENCES bikeway (bikewayId) ON DELETE CASCADE
    );

----------------------------------------------------------------------------------------------
DROP VIEW IF EXISTS bikeway_overview;

-- Create the view for bikeways. I use join here to get matched value.
CREATE VIEW
    bikeway_overview AS
SELECT
    bikeway.bikewayId,
    bikeway.name AS bikeway_name,
    bikeway.year,
    bikeway.status,
    bikeway.speedLimit,
    bikeway.comment_count,
    surface_type.name AS surface_type,
    coordinates.start_lon,
    coordinates.start_lat,
    coordinates.end_lon,
    coordinates.end_lat,
    geo_point.lon,
    geo_point.lat
FROM
    bikeway
    JOIN geo_point ON geo_point.bikeway_id = bikeway.bikewayId
    JOIN coordinates ON coordinates.bikeway_id = bikeway.bikewayId
    JOIN surface_type ON surface_type.id = bikeway.surface_type_id;

----------------------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS update_bikeway;

--This Trigger will change comment_count when matched bikeway is being commented;
--It will count the latest comments of the matched bikeway.
CREATE TRIGGER update_bikeway AFTER INSERT ON comment BEGIN
UPDATE bikeway
SET
    comment_count = (
        SELECT
            COUNT(*)
        FROM
            comment
        WHERE
            bikeway_id = NEW.bikeway_id
    )
WHERE
    bikewayId = NEW.bikeway_id;

END;

----------------------------------------------------------------------------------------------
-- create index for bikeway name, when searching by bikeway name it will use index
DROP INDEX IF EXISTS index_bikeway_name;

CREATE INDEX index_bikeway_name ON bikeway (name);