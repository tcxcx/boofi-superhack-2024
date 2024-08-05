import BlurFade from "@/components/magicui/blur-fade";

const HeaderBox = ({
  type = "title",
  title,
  subtext,
  user,
}: HeaderBoxProps) => {
  return (
    <div className="header-box">
      <h1 className="header-box-title">
        <BlurFade delay={0.25} inView>
          {title}
          {type === "greeting" && (
            <span className="text-bankGradient">&nbsp;{user}</span>
          )}
        </BlurFade>
      </h1>
      <BlurFade delay={0.4} inView>
        <p className="header-box-subtext">{subtext}</p>
      </BlurFade>
    </div>
  );
};

export default HeaderBox;
