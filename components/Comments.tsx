import { hasRight } from "@libs/server/Authorization";
import { Comment, User } from "@prisma/client";
import Image from "next/image";

const Comments = ({
  comments,
  handleDelete,
  user,
  ...props
}: {
  comments?: Comment[];
  handleDelete: any;
  user?: User | null;
  className?: any;
}) => {
  return comments && comments.length !== 0 ? (
    <div {...props} className="mt-3 space-y-3">
      {comments.map((comment) => {
        return (
          <Comment
            handleDelete={handleDelete}
            key={comment.id}
            comment={comment}
            user={user}
          />
        );
      })}
    </div>
  ) : null;
};

export function Comment({ comment, handleDelete, user }: any) {
  return (
    <div
      key={comment.id}
      className="border-2 border-slate-300 p-2 pb-4 rounded-md flex-col flex space-y-3"
    >
      <div className="flex">
        <Image
          className="rounded-full"
          src="/cube.png"
          height="40"
          width="40"
          alt="profile"
        />
        <div className="text-lg self-end pb-1 ml-3 text-slate-600">
          {comment.commenter.name}
        </div>
        {hasRight(
          { method: "delete", theme: "comment" },
          user,
          null,
          comment
        ) ? (
          <div
            className="ml-auto select-none"
            onClick={() => handleDelete(comment.id)}
          >
            X
          </div>
        ) : null}
      </div>
      <div className="flex ml-3 text-sm whitespace-normal">{comment.text}</div>
    </div>
  );
}

export function NewComment({ session, handler, register, openLogin }: any) {
  if (!session || !session.data) {
    return (
      <div className="flex justify-center py-10 whitespace-pre">
        댓글을 달기 위해서는{" "}
        <span onClick={openLogin} className="text-blue-600 font-bold">
          로그인
        </span>
        이 필요합니다.
      </div>
    );
  }
  return (
    <form onSubmit={handler}>
      <div className="border-2 border-slate-300 p-2 mt-4 rounded-md flex-col flex space-y-3">
        <div className="flex">
          <Image
            className="rounded-full"
            src={session.data.user?.image ?? ""}
            height="40"
            width="40"
            alt="profile"
          />
          <div className="text-lg self-end pb-1 ml-3 text-blue-500">
            {session.data.user?.name}
          </div>
        </div>
        <input
          {...register("text", { required: true, maxLength: 300 })}
          className="ml-1 text-sm border-2 rounded p-2"
        ></input>
      </div>
    </form>
  );
}

export default Comments;
