namespace GraParagrafowa.Models
{
    public class DecisionBlock
    {
        public int Id { get; set; }
        public int InStoryId { get; set; }
        public string Description { get; set; }
        public string ImagePath { get; set; }
        public List<Choice> Choices { get; set; }
        

    }
}
