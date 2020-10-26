const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

const { 
  GraphQLSchema,
  GraphQLObjectType, 
  GraphQLList,
  GraphQLString, 
  GraphQLID,
  GraphQLInt
} = graphql;

// dummy data
// var books = [
//   { name: 'A Confição da Leoa', genre: 'Ficção', id: '1', authorId: '11' },
//   { name: 'Niketche', genre: 'Romance', id: '2', authorId: '12' },
//   { name: 'Karina Wa Karingana', genre: 'Poesia', id: '3', authorId: '13' },
//   { name: 'Baladas de Amor ao Vento', genre: 'Romance', id: '4', authorId: '12' },
//   { name: 'Jesusalém', genre: 'Romance', id: '5', authorId: '11' },
//   { name: 'Sétimo Juramento', genre: 'Ficção', id: '6', authorId: '11' },
// ];

// var authors = [
//   { name: 'Mia Couto', age: 59, id: '11'},
//   { name: 'Paulina Chiziane', age: 65, id: '12'},
//   { name: 'Jose Craveirinha', age: 75, id: '13'},
// ];

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Author.findById(parent.authorId);
        // return _.find(authors, {id: parent.authorId})
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({ authorId: parent.id });
        // return _.filter(books, { authorId: parent.id });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args){
        return Book.findById(args.id);
        // return _.find(books, { id: args.id });
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Author.findById(args.id);
        // return _.find(authors, { id: args.id })
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve() {
        return Book.find({});
        // return books
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve() {
        return Author.find({});
        // return authors
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLID }
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
