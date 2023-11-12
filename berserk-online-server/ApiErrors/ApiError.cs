namespace berserk_online_server.ApiErrors
{
    public abstract class ApiError
    {
#pragma warning disable CS8618 // Поле, не допускающее значения NULL, должно содержать значение, отличное от NULL, при выходе из конструктора. Возможно, стоит объявить поле как допускающее значения NULL.
        protected ApiError(object? ctx = null)
#pragma warning restore CS8618 // Поле, не допускающее значения NULL, должно содержать значение, отличное от NULL, при выходе из конструктора. Возможно, стоит объявить поле как допускающее значения NULL.
        {
            Context = ctx;
        }

        public int Id { get; set; }

        public string Message { get; protected set; }

        public object? Context { get; protected set; }
    }
}
