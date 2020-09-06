using System.Collections.Generic;
using System.Threading.Tasks;
using ReceitaBlog.Models;

namespace ReceitaBlog.Services
{
    public interface IReceitaService
    {
        //List<BlogPost> GetLatestPosts();
        string GetPostText(string link);

        //List<BlogPost> GetOlderPosts(int oldestPostId);

        //void Create(BlogPost post);
        Task Create(BlogPost post);

        List<BlogPost> GetLatestPosts();
        List<BlogPost> GetOlderPosts(int oldestPostId);
    }
}