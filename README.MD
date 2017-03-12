# serveCSV
.NET core api for serving a csv file in the form of a table

### Usage

```
dotnet restore
dotnet build
dotnet run
```

The csv file to serve is defined in the appsettings.json file, along with the default id for the returned table. The table is served from api/csv. Using api/csv/{tableid} will serve up a table with the supplied id.