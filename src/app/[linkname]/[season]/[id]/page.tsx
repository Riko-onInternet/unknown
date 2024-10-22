import PlayerComponent from "./components/player";

export default function Player() {
  // const videoSrc = "/video/murder_drones/1/md_s1e1.mp4";
  const videoSrc = "https://drive.google.com/file/d/1asuzUyQEd5IyRDNe4ai72VT3ueLIoktb/view?usp=sharing";
  const typeVideo = "video/mp4";


  return <PlayerComponent videoSrc={videoSrc} typeVideo={typeVideo} />;
}
