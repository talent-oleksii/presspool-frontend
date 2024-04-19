const CreatorLayout = (props: React.PropsWithChildren) => {
  return (
    <div>
      <h2>Creator Portal Layout</h2>
      {props?.children}
    </div>
  );
};

export default CreatorLayout;
