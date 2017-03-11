using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace serveCSV.Controllers
{
    [Route("api/[controller]")]
    public class CSVController : Controller
    {

        private csvProcessor csv;
        private readonly CSVOptions _options;

        public CSVController(IOptions<CSVOptions> options){
            _options = options.Value;
            csv = new csvProcessor(_options.FileName, _options.TableID);
        }

        // GET api/csv
        /// <summary>
        /// the default get action for this api.
        /// </summary>
        /// <returns>a html table with the default id</returns>
        [HttpGet]
        [Produces("text/html")]
        public string Get()
        {
            return csv.Table;
        }

        // GET api/csv/{tablename}
        /// <summary>
        /// returns an html table, with tablename as the  id
        /// </summary>
        /// <param name="tablename"> the id value for the table</param>
        /// <returns>a html table with a specific id</returns>
        [HttpGet("{tablename}")]
        [ProducesAttribute("text/html")]
        public string GetNamedTable(string tablename)
        {
            csv = new csvProcessor(_options.FileName, tablename);
            return csv.Table;
        }
    }

    /// <summary>
    ///  Reads a csv file and produce an html table
    /// </summary>
    internal class csvProcessor {

        private string _filename;
        private string _table;
        private string _id;

        /// <summary>
        /// the table that this object provides. builds the table as needed.
        /// </summary>
        /// <returns>the table in html</returns>
        public string Table{
            protected set{
                _table = value;
            }
            get{
                if(_table == null){
                    _table = buildTable(_id);
                }
                return _table;
            }
        }

        /// <summary>
        ///  the constructor for the csv processor
        /// </summary>
        /// <param name="file"> the file to read and process</param>
        public csvProcessor(string file, string id){
            _filename = file;
            _id = id;
        }

        /// <summary>
        /// Reads the provided csv file and produces a html table
        /// </summary>
        /// <param name="id">the id that the table should have</param>
        /// <returns></returns>
        private string buildTable(string id="csv"){

            string partTable = $"<table id='{id}'>";

            using(StreamReader tr = new StreamReader(new FileStream(_filename, FileMode.Open, FileAccess.Read))){
                //Set up headers
                string[] headers = tr.ReadLine().Split(',');
                partTable += "<thead>";
                foreach (string header in headers){
                    partTable += $"<th>{header}</th>";
                }
                partTable += "</thead><tbody>";
                //set up rows
                while(!tr.EndOfStream){
                    string[] row = tr.ReadLine().Split(',');
                    partTable += "<tr>";
                    foreach(string item in row){
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
}
