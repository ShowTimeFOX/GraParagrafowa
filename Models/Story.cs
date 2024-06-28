namespace GraParagrafowa.Models
{
    public class Story
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<Block> MyProperty { get; set; }
    }
}
