namespace GraParagrafowa.Models
{
    public class StoryItem
    {
        public string Id { get; set; }
        public string Description { get; set; }
        public int DecisionCount { get; set; }
        public string Children { get; set; }
        public byte[] Image { get; set; }  // Jeśli chcesz przechowywać obraz jako tablicę bajtów
        public string Responses { get; set; } // Dodane pole Responses
    }

}
