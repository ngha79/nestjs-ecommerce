export class CreateNotificationDto {
  noti_title: string;
  noti_desc: string;
  noti_url: string;
  userReceiverId?: string;
  shopReceiverId?: string;
}
