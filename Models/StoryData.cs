namespace GraParagrafowa.Models
{
    public class StoryData
    {
        public int StoryId { get; set; }
        public byte[] Photo { get; set; }
        public string StoryName { get; set; }
        public List<StoryItem> FormData { get; set; }
    }
}
