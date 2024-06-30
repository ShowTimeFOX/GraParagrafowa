namespace GraParagrafowa.Models
{
    public class Choice
    {
        public int Id { get; set; }
        public DecisionBlock OutcomeBlock { get; set; }
        public string Text { get; set; }
    }
}
