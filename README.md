# restaurant-api
Using this as personal practice in developing apis.

# This README file is currently under construction. While the app is mostly done I have not had time yet to write appropriate docs.
## I apologize for any inconvenience this may cause.

From Relation Diagram

Changes - employees no longer hold arrays of customers, rather of tables.

Eliminated Party as a model but rather semi replacing it with table as the party.

customer no longer has partyId to match removal of party as model. Also no more reservations array for a single customer rather just one reservation Id associated not required.

table on reservation is now tableId;

restaurant array of customers is now an array of tables.
