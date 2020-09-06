namespace ReceitaBlog.Models
{
    public class ReceitasDatabaseSettings : IReceitasDatabaseSettings
    {
        public string ReceitasCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }
}
