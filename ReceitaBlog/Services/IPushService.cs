using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Lib.Net.Http.WebPush;

namespace ReceitaBlog.Services
{
    public interface IPushService
    {
        Task DiscardSubscriptionAsync(string endpoint);
        string GetKey();
        Task SendNotificationAsync(PushMessage message);
        Task<int> StoreSubscriptionAsync([FromBody] PushSubscription subscription);
    }

}
