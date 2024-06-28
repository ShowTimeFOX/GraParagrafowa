namespace GraParagrafowa.Models
{
    public class Block
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public string ImagePath { get; set; }
        public Block NextBlock { get; set; }
    }
}
