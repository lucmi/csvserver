using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace serveCSV.Controllers
{
    [Route("api/[controller]")]
    public class CSVController : Controller
    {

        private csvProcessor csv;
        private readonly CSVOptions _options;

        public CSVController(IOptions<CSVOptions> options)
        {
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
            csv.Id = tablename;
            return csv.Table;
        }
    }
}
    
