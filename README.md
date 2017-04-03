# restaurant-api
Using this as personal practice in developing apis.



From Relation Diagram

Changes - employees no longer hold arrays of customers, rather of tables.

Believe I will be eliminating Party as a model but rather semi replacing it with table as the party.

customer no longer has partyId to match removal of party as model. Also no more reservations array for a single customer rather just one reservation Id associated not required.

table on reservation is now tableId;
