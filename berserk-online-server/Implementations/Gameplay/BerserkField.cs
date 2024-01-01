using berserk_online_server.Data_objects.Cards;
using berserk_online_server.Data_objects.Gameplay;
using System.Drawing;

namespace berserk_online_server.Implementations.Gameplay
{
    public sealed class BerserkField
    {
        private readonly FieldCell?[,] _field = new FieldCell?[6, 5];
        public BerserkField()
        {
            for (int i = 0; i < 6; i++)
            {
                for (int j = 0; j < 5; j++)
                    _field[i, j] = new FieldCell();
            }
        }
        public PlayableCard? GetCell(Point point)
        {
            return _field[point.Y, point.X].Card;
        }
        public void SetCell(PlayableCard card, Point point)
        {
            _field[point.Y, point.X].Card = card;
        }
        public void ClearCell(Point point)
        {
            _field[point.Y, point.X].Card = null;
        }
        public void ClearCell(string cardId)
        {
            for (int i = 0; i < 6; i++)
            {
                for (int j = 0; j < 5; j++)
                {
                    if (cardId == _field[i, j].Card?.Uid)
                    {
                        _field[i, j].Card = null;
                        return;
                    }
                }   
            }
        }
        public void MoveCell(Point oldPoint, Point newPoint)
        {
            if (_field[newPoint.Y, newPoint.X] == null || _field[oldPoint.Y, oldPoint.X] == null)
                throw new InvalidOperationException();
            var cardToMove = GetCell(oldPoint)!;
            SetCell(cardToMove, newPoint);
            ClearCell(oldPoint);
        }
        public List<List<FieldCell?>> GetAll()
        {
            List<List<FieldCell?>> field = new();
            for (int i = 0; i < 6; i++)
            {
                field.Add(new List<FieldCell?>());
                for (int j = 0; j < 5; j++)
                {
                    field[i].Add(_field[i, j]);
                }
            }
            return field;
        }
        public PlayableCard Find(string id)
        {
            for (int i = 0; i < 6; i++)
            {
                for (int j = 0; j < 5; j++)
                    if (id == _field[i, j].Card?.Uid)
                        return _field[i, j].Card!;
            }
            throw new ArgumentNullException();
        }
    }
}
