using berserk_online_server.Data_objects.Cards;
using berserk_online_server.DTO.Cards;
using System.Text.Json;

namespace berserk_online_server.Facades.CardBase
{

    public class CardProvider
    {
        private DeserealizedCard[] _cards;
        public CardProvider()
        {
            var jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "cards.json");
            var jsonString = "";
            using (var fs = new StreamReader(jsonPath))
            {
                jsonString = fs.ReadToEnd();
            }
            if (jsonString == "")
                throw new ArgumentNullException("failed to read " + jsonPath);
#pragma warning disable CS8601 // Возможно, назначение-ссылка, допускающее значение NULL.
            _cards = JsonSerializer.Deserialize<DeserealizedCard[]>(jsonString);
#pragma warning restore CS8601 // Возможно, назначение-ссылка, допускающее значение NULL.
            if (_cards == null)
                throw new ArgumentNullException(nameof(_cards) + " is null");
            _cards = _cards.OrderBy(x => x.Id).ToArray();
        }
        public DeserealizedCard[] GetAll()
        {
            return _cards;
        }
        public DeserealizedCard[] Find(string? query, FilterParams filterParams,  int limit)
        {
            var result = filter(filterParams);
            if (query != null)
                result = result.OrderBy(c => compareNames(c.Name, query));
            if (limit > 0 && limit < _cards.Length)
                result = result.Take(limit);
            return result.ToArray();
        }
        public DeserealizedCard GetCard(int id)
        {
            return _cards[id];
        }
        public DeserealizedCard[] GetCards(int[] ids)
        {
            var cards = new List<DeserealizedCard>();
            foreach (var id in ids)
            {
                cards.Add(GetCard(id));
            }
            return cards.ToArray();
        }
        private IEnumerable<DeserealizedCard> filter(FilterParams filter)
        {
            IEnumerable<DeserealizedCard> filteredCards = _cards;
            if (filter.Health != null)
                filteredCards = filteredCards
                    .Where(c => c.Health >= filter.Health.From && c.Health <= filter.Health.To);
            if (filter.Elite != null)
                filteredCards = filteredCards
                    .Where(c => c.Elite == filter.Elite);
            if (filter.Moves != null)
                filteredCards = filteredCards
                    .Where(c => c.Moves >= filter.Moves.From && c.Moves <= filter.Moves.To);
            if (filter.Element != null)
                filteredCards = filteredCards
                    .Where(c => checkElements(c.Element, filter.Element));
            if (filter.Price != null)
                filteredCards = filteredCards
                    .Where(c => c.Price >= filter.Price.From && c.Price <= filter.Price.To);
            if (filter.Rarity != null)
                filteredCards = filteredCards
                    .Where(c => c.Rarity == filter.Rarity);
            if (filter.Type != null)
                filteredCards = filteredCards
                    .Where(c => c.Type == filter.Type);
            return filteredCards;
        }
        private int compareNames(string cardName, string userInput)
        {
            var cardWords = cardName.ToLower().Split(' ');
            var userWords = userInput.ToLower().Split(' ');
            var results = new List<int>();
            foreach (var cardWord in cardWords)
            {
                foreach (var userWord in userWords)
                {
                    results.Add(levenshteinDistance(cardWord, userWord));
                }
            }
            return results.Min();
        }
        private int levenshteinDistance(string s1, string s2)
        {
            var n = s1.Length + 1;
            var m = s2.Length + 1;
            var matrixD = new int[n, m];

            const int deletionCost = 0;
            const int insertionCost = 1;

            for (var i = 0; i < n; i++)
            {
                matrixD[i, 0] = i;
            }

            for (var j = 0; j < m; j++)
            {
                matrixD[0, j] = j;
            }

            for (var i = 1; i < n; i++)
            {
                for (var j = 1; j < m; j++)
                {
                    var substitutionCost = s1[i - 1] == s2[j - 1] ? 0 : 1;

                    matrixD[i, j] = Math.Min(matrixD[i - 1, j] + deletionCost,
                        Math.Min(matrixD[i, j - 1] + insertionCost,
                            matrixD[i - 1, j - 1] + substitutionCost));
                }
            }

            return matrixD[n - 1, m - 1];
        }
        private bool checkElements(string[] el1, string[] el2)
        {
            foreach (var el in el1)
            {
                foreach(var comparableEl  in el2)
                {
                    if (el == comparableEl) return true;
                }
            }
            return false;
        }
    }
}
