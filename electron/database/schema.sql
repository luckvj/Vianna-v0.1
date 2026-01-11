-- Vianna Database Schema
-- Universal Life Management Hub

-- Events / Calendar
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_time INTEGER NOT NULL,
  end_time INTEGER,
  all_day INTEGER DEFAULT 0,
  category TEXT DEFAULT 'personal',
  color TEXT,
  location TEXT,
  recurrence TEXT,
  reminder INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  due_date INTEGER,
  priority INTEGER DEFAULT 0,
  completed INTEGER DEFAULT 0,
  completed_at INTEGER,
  list_id TEXT,
  parent_id TEXT,
  position INTEGER DEFAULT 0,
  tags TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (list_id) REFERENCES task_lists(id) ON DELETE SET NULL,
  FOREIGN KEY (parent_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- Task Lists
CREATE TABLE IF NOT EXISTS task_lists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  icon TEXT DEFAULT 'list',
  position INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Notes
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  title TEXT,
  content TEXT,
  folder_id TEXT,
  pinned INTEGER DEFAULT 0,
  tags TEXT,
  color TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (folder_id) REFERENCES note_folders(id) ON DELETE SET NULL
);

-- Note Folders
CREATE TABLE IF NOT EXISTS note_folders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  parent_id TEXT,
  position INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (parent_id) REFERENCES note_folders(id) ON DELETE CASCADE
);

-- Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  photo TEXT,
  company TEXT,
  job_title TEXT,
  birthday INTEGER,
  notes TEXT,
  category TEXT DEFAULT 'personal',
  favorite INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  color TEXT DEFAULT '#6366f1',
  icon TEXT DEFAULT 'folder',
  deadline INTEGER,
  progress INTEGER DEFAULT 0,
  -- Property-specific fields (for real estate)
  is_property INTEGER DEFAULT 0,
  property_address TEXT,
  property_price REAL,
  property_beds INTEGER,
  property_baths INTEGER,
  property_sqft INTEGER,
  property_year_built INTEGER,
  property_lot_size TEXT,
  property_hoa REAL,
  property_status TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Files
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  type TEXT,
  size INTEGER,
  folder_id TEXT,
  tags TEXT,
  thumbnail TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (folder_id) REFERENCES file_folders(id) ON DELETE SET NULL
);

-- File Folders
CREATE TABLE IF NOT EXISTS file_folders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  parent_id TEXT,
  position INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (parent_id) REFERENCES file_folders(id) ON DELETE CASCADE
);

-- Goals
CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'personal',
  target_date INTEGER,
  progress INTEGER DEFAULT 0,
  milestones TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Habits
CREATE TABLE IF NOT EXISTS habits (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  frequency TEXT DEFAULT 'daily',
  color TEXT DEFAULT '#10b981',
  icon TEXT DEFAULT 'check',
  target_count INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Habit Logs
CREATE TABLE IF NOT EXISTS habit_logs (
  id TEXT PRIMARY KEY,
  habit_id TEXT NOT NULL,
  date INTEGER NOT NULL,
  count INTEGER DEFAULT 1,
  notes TEXT,
  FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
);

-- Settings
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Activity Log (for recent activity feed)
CREATE TABLE IF NOT EXISTS activity_log (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  entity_title TEXT,
  details TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Link Tables for Relationships
CREATE TABLE IF NOT EXISTS event_files (
  event_id TEXT NOT NULL,
  file_id TEXT NOT NULL,
  PRIMARY KEY (event_id, file_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS task_files (
  task_id TEXT NOT NULL,
  file_id TEXT NOT NULL,
  PRIMARY KEY (task_id, file_id),
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS note_files (
  note_id TEXT NOT NULL,
  file_id TEXT NOT NULL,
  PRIMARY KEY (note_id, file_id),
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_tasks (
  project_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  PRIMARY KEY (project_id, task_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_contacts (
  project_id TEXT NOT NULL,
  contact_id TEXT NOT NULL,
  role TEXT,
  PRIMARY KEY (project_id, contact_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_events (
  project_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  PRIMARY KEY (project_id, event_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_files (
  project_id TEXT NOT NULL,
  file_id TEXT NOT NULL,
  PRIMARY KEY (project_id, file_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_notes (
  project_id TEXT NOT NULL,
  note_id TEXT NOT NULL,
  PRIMARY KEY (project_id, note_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_list_id ON tasks(list_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_notes_folder_id ON notes(folder_id);
CREATE INDEX IF NOT EXISTS idx_notes_pinned ON notes(pinned);
CREATE INDEX IF NOT EXISTS idx_contacts_category ON contacts(category);
CREATE INDEX IF NOT EXISTS idx_contacts_favorite ON contacts(favorite);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON habit_logs(date);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);

-- Insert default settings
INSERT OR IGNORE INTO settings (key, value) VALUES
  ('theme', 'dark'),
  ('accentColor', '#6366f1'),
  ('userName', 'User'),
  ('showWeather', 'true'),
  ('defaultCalendarView', 'week'),
  ('startOfWeek', 'sunday'),
  ('timeFormat', '12h'),
  ('dateFormat', 'MM/DD/YYYY');

-- Insert default task list
INSERT OR IGNORE INTO task_lists (id, name, color, icon, position) VALUES
  ('default', 'My Tasks', '#6366f1', 'inbox', 0);
