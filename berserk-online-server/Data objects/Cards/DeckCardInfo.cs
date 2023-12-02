namespace berserk_online_server.DTO.Cards
{
    public class DeckCardInfo : DeserealizedCard
    {
        public DeckCardInfo(DeserealizedCard card)
        {
            var cardProps = card.GetType().GetProperties();
            var myProps = GetType().GetProperties();
            var myPropsMap = myProps.ToLookup(x => x.Name);
            foreach (var prop in cardProps)
            {
                if (myPropsMap.Contains(prop.Name))
                {
                    myPropsMap[prop.Name].First().SetValue(this, prop.GetValue(card));
                }
            }
        }
        public DeckCardInfo() { }
        public int Amount { get; set; }
    }
}
