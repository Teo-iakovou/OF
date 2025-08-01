import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

const ShareButtons = ({ url, title }: { url: string; title: string }) => (
  <div className="flex space-x-4">
    <FacebookShareButton url={url} title={title}>
      <FacebookIcon size={32} round />
    </FacebookShareButton>
    <TwitterShareButton url={url} title={title}>
      <TwitterIcon size={32} round />
    </TwitterShareButton>
    <WhatsappShareButton url={url} title={title}>
      <WhatsappIcon size={32} round />
    </WhatsappShareButton>
  </div>
);

export default ShareButtons;
