import { Request, Response } from 'express';
import { Post } from '../models/Post.js';

export const getFeed = async (req: Request, res: Response) => {
  try {
    const feed = await Post.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: '$author',
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          title: 1,
          createdAt: 1,
          image: '$coverImage',
          type: { $literal: 'post' },
          author: {
            id: '$author._id',
            name: '$author.name',
            image: '$author.image',
          },
        },
      },

      {
        $unionWith: {
          coll: 'cultures',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'author',
              },
            },
            {
              $unwind: '$author',
            },
            {
              $project: {
                _id: 0,
                id: '$_id',
                title: 1,
                image: '$coverImage',
                createdAt: 1,
                type: { $literal: 'culture' },
                author: {
                  id: '$author._id',
                  name: '$author.name',
                  image: '$author.image',
                },
              },
            },
          ],
        },
      },

      {
        $unionWith: {
          coll: 'events',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'author',
              },
            },
            {
              $unwind: '$author',
            },
            {
              $project: {
                _id: 0,
                id: '$_id',
                title: 1,
                image: '$coverImage',
                createdAt: 1,
                type: { $literal: 'event' },
                author: {
                  id: '$author._id',
                  name: '$author.name',
                  image: '$author.image',
                },
              },
            },
          ],
        },
      },

      {
        $unionWith: {
          coll: 'blogs',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'author',
              },
            },
            {
              $unwind: '$author',
            },
            {
              $project: {
                _id: 0,
                id: '$_id',
                title: 1,
                image: '$coverImage',
                createdAt: 1,
                type: { $literal: 'blog' },
                author: {
                  id: '$author._id',
                  name: '$author.name',
                  image: '$author.image',
                },
              },
            },
          ],
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    return res.status(200).json({ feed });
  } catch (err: any) {
    console.error('Error while fetching feed:', err.message);

    return res.status(500).json({
      msg: 'Internal server error while fetching feed.',
    });
  }
};
