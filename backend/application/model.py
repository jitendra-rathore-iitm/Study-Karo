from . import db
from sqlalchemy.dialects.postgresql import JSONB


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)
    
    # Relationships
    flashcard_sets = db.relationship('FlashcardSet', backref='user', lazy=True, cascade="all, delete-orphan")
    resumes = db.relationship('Resume', backref='user', lazy=True, cascade="all, delete-orphan")
    
    def __repr__(self):
        return f'<User {self.email}>'




class FlashcardSet(db.Model):
    __tablename__ = 'flashcard_sets'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)
    title = db.Column(db.String(255), nullable=False, default="Untitled Flashcards")
    source_info = db.Column(db.Text, nullable=True)
    flashcards = db.relationship('Flashcard', backref='flashcard_set', lazy=True, cascade="all, delete-orphan")
    
    def __repr__(self):
        return f'<FlashcardSet {self.title}>'


class Flashcard(db.Model):
    __tablename__ = 'flashcards'
    id = db.Column(db.Integer, primary_key=True)
    set_id = db.Column(db.Integer, db.ForeignKey('flashcard_sets.id'), nullable=False, index=True)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    
    def __repr__(self):
        return f'<Flashcard {self.id}: {self.question[:30]}...>'


class Resume(db.Model):
    __tablename__ = 'resumes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)
    title = db.Column(db.String(255), default="My Resume")
    full_content = db.Column(db.Text, nullable=True)
    generated_bullet_points = db.Column(JSONB, nullable=True)
    critique = db.Column(db.Text, nullable=True)
    
    def __repr__(self):
        return f'<Resume {self.title}>'