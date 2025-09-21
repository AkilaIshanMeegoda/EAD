using System.Threading.Tasks;

namespace EVCharge.Backend.Repositories
{
  // Generic interface. None of the concrete repos must implement this to compile.
  public interface IRepository<T, TKey>
  {
    Task<T?> GetAsync(TKey id);
    Task InsertAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(TKey id);
  }
}
