### for checking which docker container are running
```
docker ps
```
### for start docker container
```
docker start container_name
```
### for stop docker container
```
docker stop container_name
```
### see all docker container
```
docker ps -a
```
### Inside a docker container check database and tables
```
docker exec -it container_name bash

# to go on database
psql -U user_name -d database_name

# to show all tables
\dt

inside a table
select * from table_name;

```



