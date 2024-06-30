namespace GraParagrafowa.Models
{
    public class Story
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImagePath { get; set; }
        public List<DecisionBlock> HistoryBlocks { get; set; }
    }
}
