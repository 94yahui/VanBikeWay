import bikeways from "./bikeways.json" with {type: 'json'};

import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';

export const db = new DatabaseSync(path.join(import.meta.dirname, '/data.db'), { enableForeignKeyConstraints: false });


//--clear all data from database file
db.prepare('DELETE FROM coordinates;').run();
db.prepare('DELETE FROM geo_point;').run();
db.prepare('DELETE FROM bikeway;').run();
db.prepare('DELETE FROM surface_type;').run();
db.prepare('DELETE FROM comment;').run();
db.prepare('DELETE FROM coordinates;').run();

// console.log(bikeway)

bikeways.forEach(b=>{


    db.prepare(`
        INSERT INTO coordinates(
        bikeway_id,
        start_lon,
        start_lat,
        end_lon,
        end_lat
        ) VALUES (
         ?,
         ?,
         ?,
         ?,
         ?
        );
        `).run(
            b.object_id,
            b.geom.geometry.coordinates[0][0],
        b.geom.geometry.coordinates[0][1],
        b.geom.geometry.coordinates[b.geom.geometry.coordinates.length-1][0],
        b.geom.geometry.coordinates[b.geom.geometry.coordinates.length-1][1],
        )

    db.prepare(`
        INSERT INTO geo_point(
        bikeway_id,
        lon,
        lat
        ) VALUES (
         ?,
         ?,
         ?
        );
        `).run(
            b.object_id,
            b.geo_point_2d.lon,
            b.geo_point_2d.lat
        )

    let matchingBikeType = db.prepare(`
        SELECT * FROM surface_type WHERE
        "name" is ?;
        `
    ).all(b.surface_type || null );


    let bikeTypeId;
    if (matchingBikeType.length!=0) {
        bikeTypeId = matchingBikeType[0].id;

        
    } else {
      const newBikewayType =  db.prepare(`
            INSERT INTO surface_type (
            name
            ) VALUES (
             ?
            );
            `).run(b.surface_type || null)
        bikeTypeId = newBikewayType.lastInsertRowid;
    }

    db.prepare(`
        INSERT INTO bikeway (
            bikewayId,
            name,
            year,
            status,
            speedLimit,
            surface_type_id
            ) VALUES (
             ?,
             ?,
             ?,
             ?,
             ?,
             ?
            );
            `).run(
                b.object_id,
                b.bike_route_name,
                b.year_of_construction || null,
                b.status|| null,
                b.speed_limit || null,
                bikeTypeId
            )
        
});

