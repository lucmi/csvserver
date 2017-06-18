using System;
using System.IO;
using System.Text.RegularExpressions;

/// <summary>
///  Reads a csv file and produce an html table
/// </summary>
public class csvProcessor
{

    private string _filename;
    private string _table;
    private string _id;

    /// <summary>
    /// the table that this object provides. builds the table as needed.
    /// </summary>
    /// <returns>the table in html</returns>
    public string Table
    {
        protected set
        {
            _table = value;
        }
        get
        {
            if (_table == null)
            {
                _table = buildTable(_id);
            }
            return _table;
        }
    }

    public string Id
    {
        set { _id = value; }
    }

    /// <summary>
    ///  the constructor for the csv processor
    /// </summary>
    /// <param name="file"> the file to read and process</param>
    public csvProcessor(string file, string id)
    {
        _filename = file;
        _id = id;
    }

    /// <summary>
    /// Reads the provided csv file and produces a html table
    /// </summary>
    /// <param name="id">the id that the table should have</param>
    /// <returns></returns>
    private string buildTable(string id = "csv")
    {

        string partTable = $"<table id='{id}'>";

        using (StreamReader tr = new StreamReader(new FileStream(_filename, FileMode.Open, FileAccess.Read)))
        {
            //Set up headers
            string regex = ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)";
            string[] headers = Regex.Split(tr.ReadLine(), regex);
            partTable += "<thead>";
            foreach (string header in headers)
            {
                partTable += $"<th>{header}</th>";
            }
            partTable += "</thead><tbody>";
            //set up rows
            while (!tr.EndOfStream)
            {
                
                string[] row = Regex.Split(tr.ReadLine(), regex);
                partTable += "<tr>";
                foreach (string item in row)
                {
                    partTable += $"<td>{item}</td>";
                }
                partTable += "</tr>";
            }
            partTable += "</tbody>";
        }

        partTable += "</table>";

        return partTable;
    }

}