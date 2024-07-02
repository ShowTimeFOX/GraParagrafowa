namespace GraParagrafowa.Models
{
    public class StoryData
    {
        public byte[] Photo { get; set; }
        public string StoryName { get; set; }
        public List<StoryItem> FormData { get; set; }
    }
}
