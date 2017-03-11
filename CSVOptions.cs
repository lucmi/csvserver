/// <summary>
/// An options class for the csv processor
/// </summary>
public class CSVOptions{
    public CSVOptions(){
        FileName = string.Empty;
    }

    public string FileName{get; set;}
    public string TableID{get; set;}
}