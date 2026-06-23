import { useNavigate } from 'react-router-dom';
import { BaseCardProps } from '../types/globals';
import { BASE_URL } from '../App';
import { RiEdit2Fill } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import { useThemeClasses } from '../hooks/useThemeClasses';

export type PostCardProps = BaseCardProps & {
  title: string;
  description: string;
  image: string;
};

export const PostSkeletonCard = () => {
  const theme = useThemeClasses();
  
  return (
    <div className={`w-[90%] lg:w-2/3 flex ${theme.border} rounded-2xl overflow-hidden animate-pulse`}>
      <div className={`w-[40%] h-80 ${theme.bgSkeleton}`} />
      <div className="w-[60%] p-6 flex flex-col gap-4 justify-center">
        <div className={`w-4/5 h-8 rounded ${theme.bgSkeleton}`} />
        <div className={`w-full h-20 rounded ${theme.bgSkeletonSubtle}`} />
      </div>
    </div>
  );
};

const PostCard = ({
  id,
  title,
  description,
  image,
  handleEdit,
}: PostCardProps) => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const theme = useThemeClasses();

  return (
    <div
      className={`w-[90%] lg:w-2/3 flex ${theme.border} rounded-2xl overflow-hidden
        ${theme.borderHover} hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer group`}
      onClick={() => navigate(id)}
    >
      <div className="w-[40%] h-80 overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={`${BASE_URL}${image}`}
          alt={title}
        />
      </div>
      <div className={`w-[60%] p-6 flex flex-col gap-4 justify-center ${theme.bgSubtle}`}>
        <h1 className="text-primary text-xl font-bold">{title}</h1>
        <p className={`${theme.textSecondary} text-sm leading-relaxed line-clamp-4`}>
          {description}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-primary text-sm font-semibold group-hover:underline">
            Read more
          </span>
          {authState.user?.role === 'admin' && (
            <div
              className="border border-primary/30 text-primary rounded-lg p-1.5 hover:bg-primary hover:text-black
                cursor-pointer transition-all"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit?.(id);
              }}
            >
              <RiEdit2Fill className="text-lg" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
