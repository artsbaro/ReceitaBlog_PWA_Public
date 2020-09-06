using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ReceitaBlog.Models;
using Lib.Net.Http.WebPush;
using ReceitaBlog.Services;

namespace ReceitaBlog.Controllers
{

    public class HomeController : Controller
    {
        private readonly IReceitaService _blogService;

        private readonly IPushService _pushService;

        public HomeController(IReceitaService blogService, IPushService pushService)
        {
            _blogService = blogService;
            _pushService = pushService;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public JsonResult LatestBlogPosts()
        {
            var posts = _blogService.GetLatestPosts();
            return Json(posts);
        }

        public JsonResult MoreBlogPosts(int oldestBlogPostId)
        {
            var posts = _blogService.GetOlderPosts(oldestBlogPostId);
            return Json(posts);
        }

        public ContentResult Post(string link)
        {
            return Content(_blogService.GetPostText(link));
        }

        [HttpGet("publickey")]
        public ContentResult GetPublicKey()
        {
            return Content(_pushService.GetKey(), "text/plain");
        }

        //armazena subscricoes
        [HttpPost("subscriptions")]
        public async Task<IActionResult> StoreSubscription([FromBody] PushSubscription subscription)
        {
            int res = await _pushService.StoreSubscriptionAsync(subscription);

            if (res > 0)
                return CreatedAtAction(nameof(StoreSubscription), subscription);

            return NoContent();
        }

        [HttpDelete("subscriptions")]
        public async Task<IActionResult> DiscardSubscription(string endpoint)
        {
            await _pushService.DiscardSubscriptionAsync(endpoint);

            return NoContent();
        }

        [HttpPost("notifications")]
        public async Task<IActionResult> SendNotification([FromBody] PushMessageViewModel messageVM)
        {
            var message = new PushMessage(messageVM.Notification)
            {
                Topic = messageVM.Topic,
                Urgency = messageVM.Urgency
            };

            await _pushService.SendNotificationAsync(message);
            return NoContent();
        }

        [HttpPost("recipe")]
        public async Task<IActionResult> SendRecipe([FromBody] BlogPost blogPost)
        {
            await Task.FromResult(_blogService.Create(blogPost));

            if(blogPost.SendNotification)
            {
                var message = new PushMessage($"Nova Receita adicionada: {blogPost.Title}")
                {
                    Topic = "NovaReceita",
                    Urgency = PushMessageUrgency.Normal
                };

                await _pushService.SendNotificationAsync(message);
            }

            return NoContent();
        }
    }
}
