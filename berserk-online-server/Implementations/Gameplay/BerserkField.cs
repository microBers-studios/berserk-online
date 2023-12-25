using berserk_online_server.Data_objects.Cards;
using System.Drawing;

namespace berserk_online_server.Implementations.Gameplay
{
    public sealed class BerserkField
    {
        private readonly PlayableCard?[,] _field = new PlayableCard?[6, 5];
        public PlayableCard? GetCell(Point point)
        {
            return _field[point.Y, point.X];
        }
        public void SetCell(PlayableCard card, Point point)
        {
            _field[point.Y, point.X] = card;
        }
        public void ClearCell(Point point)
        {
            _field[point.Y, point.X] = null;
        }
        public void MoveCell(Point oldPoint, Point newPoint)
        {
            if (_field[newPoint.Y, newPoint.X] == null || _field[oldPoint.Y, oldPoint.X] == null)
                throw new InvalidOperationException();
            var cardToMove = GetCell(oldPoint)!;
            SetCell(cardToMove, newPoint);
            ClearCell(oldPoint);
        }
        public PlayableCard?[,] GetAll() => _field;
    }
}
