import { BASE_URL } from '../App';
import { FeedCardProps } from '../types/globals';

const typeStyles = {
  post: 'bg-primary/10 text-primary',
  culture: 'bg-primary/10 text-primary',
  event: 'bg-primary/10 text-primary',
  blog: 'bg-primary/10 text-primary',
};

export const FeedCard = ({
  title,
  type,
  image,
  createdAt,
  author,
}: FeedCardProps) => {
  return (
    <article className="group flex gap-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      {/* Image */}
      <div className="h-28 w-36 shrink-0 overflow-hidden rounded-xl">
        <img
          src={`${BASE_URL}${image}`}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <h3 className="line-clamp-2 text-lg font-bold text-black">{title}</h3>

        <span
          className={`mt-2 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${typeStyles[type]}`}
        >
          {type}
        </span>
      </div>

      {/* Author */}
      <div className="flex min-w-45 flex-col items-end justify-center">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold text-black">{author.name}</p>
          </div>

          <img
            src={`${BASE_URL}${author.image}`}
            alt={author.name}
            className="h-12 w-12 rounded-full border-2 border-primary object-cover"
          />
        </div>

        <p className="mt-2 text-sm text-black/60">
          {new Date(createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      </div>
    </article>
  );
};
