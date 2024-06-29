namespace GraParagrafowa.Models
{
    public class StoryElement
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public string ImagePath { get; set; }
        public int DecisionCount { get; set; }
        public string ChildrenIds { get; set; }
    }

}
