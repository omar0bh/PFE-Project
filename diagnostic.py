#!/usr/bin/env python
"""
TechWatch AI Backend Diagnostic Script
Run this to verify your backend is configured correctly
"""

import sys
import os
from pathlib import Path

def check_environment():
    """Check if all required environment variables are set."""
    print("\n🔍 Checking Environment Variables...")
    required_vars = [
        'DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME',
        'SECRET_KEY', 'GEMINI_API_KEY'
    ]
    
    missing = []
    for var in required_vars:
        if not os.getenv(var):
            missing.append(var)
            print(f"  ❌ {var} - NOT SET")
        else:
            print(f"  ✅ {var} - OK")
    
    if missing:
        print(f"\n⚠️  Missing variables: {', '.join(missing)}")
        print("   Please set these in your .env file")
        return False
    return True


def check_database():
    """Check if database connection works."""
    print("\n🔍 Checking Database Connection...")
    try:
        from app import create_app
        app = create_app()
        
        with app.app_context():
            from app.models import Source, Article, EmailSetting
            from app.extensions import db
            
            # Test query
            source_count = Source.query.count()
            article_count = Article.query.count()
            
            print(f"  ✅ Database connected")
            print(f"  📊 Sources in DB: {source_count}")
            print(f"  📄 Articles in DB: {article_count}")
            return True
    except Exception as e:
        print(f"  ❌ Database connection failed: {e}")
        return False


def check_api_endpoints():
    """Check if API endpoints are defined."""
    print("\n🔍 Checking API Endpoints...")
    try:
        from app import create_app
        app = create_app()
        
        routes = []
        for rule in app.url_map.iter_rules():
            if '/api/' in rule.rule:
                routes.append({
                    'route': rule.rule,
                    'methods': list(rule.methods - {'HEAD', 'OPTIONS'})
                })
        
        if routes:
            print(f"  ✅ Found {len(routes)} API endpoints:")
            for r in routes:
                methods = ', '.join(r['methods'])
                print(f"     {methods:10} {r['route']}")
        else:
            print("  ❌ No API endpoints found!")
            return False
        return True
    except Exception as e:
        print(f"  ❌ Error checking endpoints: {e}")
        return False


def check_extensions():
    """Check if extensions are properly initialized."""
    print("\n🔍 Checking Flask Extensions...")
    try:
        from app.extensions import db, cors
        print(f"  ✅ SQLAlchemy loaded")
        print(f"  ✅ Flask-CORS loaded")
        return True
    except Exception as e:
        print(f"  ❌ Error loading extensions: {e}")
        return False


def main():
    """Run all checks."""
    print("=" * 50)
    print("🔧 TechWatch AI Backend Diagnostic")
    print("=" * 50)
    
    checks = [
        ("Environment", check_environment),
        ("Extensions", check_extensions),
        ("Database", check_database),
        ("API Endpoints", check_api_endpoints),
    ]
    
    results = []
    for name, check_func in checks:
        try:
            result = check_func()
            results.append((name, result))
        except Exception as e:
            print(f"  ❌ {name} check failed: {e}")
            results.append((name, False))
    
    print("\n" + "=" * 50)
    print("📋 Summary:")
    print("=" * 50)
    
    all_passed = True
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status} - {name}")
        if not result:
            all_passed = False
    
    print("=" * 50)
    
    if all_passed:
        print("\n✨ All checks passed! Your backend should be ready.\n")
        return 0
    else:
        print("\n⚠️  Some checks failed. Please fix the issues above.\n")
        return 1


if __name__ == '__main__':
    sys.exit(main())
